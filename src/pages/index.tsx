import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';
import ToggleButton from '~/components/buttons/ToggleButton';
import RandomComics from '~/components/features/RandomComics';
import RecommendedComics from '~/components/features/RecommendedComics';
import MangaBanner from '~/components/shared/Banner';
import ColumnSection from '~/components/shared/ColumnSection';
import Head from '~/components/shared/Head';
import SeasonalComics from '~/components/shared/SeasonalComics';
import Section from '~/components/shared/Section';
import SectionSwiper from '~/components/shared/SectionSwiper';
import { MANGA_BROWSE_PAGE, REVALIDATE_TIME } from '~/constants';
import { connectToDatabase } from '~/serverless/utils/connectdbData';
import { axiosClientV2 } from '~/services/axiosClient';
import { Comic } from '~/types';
import { calculateSeason } from '~/utils/calculateSeason';
import shuffle from '~/utils/randomArray';

interface HomeProps {
    topAllManga: Comic[];
    topMonthManga: Comic[];
    topWeekManga: Comic[];
    topDayManga: Comic[];
    seasonalComics: Comic[];
}

const Home: NextPage<HomeProps> = ({
    topAllManga,
    topMonthManga,
    topWeekManga,
    topDayManga,
    seasonalComics,
}) => {
    const [showRecommendedComics, setShowRecommendedComics] = useState(false);

    const handleToggleShowRecommendedComics = (state: boolean) => {
        setShowRecommendedComics(state);
    };

    const { data: comicsNewUpdated } = useSWR<{
        comics: Comic[];
        totalPages: number;
    }>(
        `?top=0`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        async (query) => {
            const res = await (
                await axiosClientV2.get(`/comics/filters${query}`)
            ).data;

            const { result } = res;

            if (result) {
                return {
                    comics: result.mangaData,
                    totalPages: result.totalPages,
                };
            }
        },
    );

    const { data: comicsNewRelease } = useSWR<{
        comics: Comic[];
        totalPages: number;
    }>(
        `?top=15`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        async (query) => {
            const res = await (
                await axiosClientV2.get(`/comics/filters${query}`)
            ).data;

            const { result } = res;

            if (result) {
                return {
                    comics: result.mangaData,
                    totalPages: result.totalPages,
                };
            }
        },
    );

    const { data: recommendedComics } = useSWR<
        { _id: Comic; votes: string[]; size: number }[]
    >(`/comics/recommended?limit=30`, async (slug) => {
        const { data } = await axiosClientV2.get(slug);

        return data?.comics || [];
    });

    return (
        <>
            <Head />

            <Toaster position="top-center" />

            <div className="flex h-fit min-h-screen flex-col">
                <MangaBanner
                    mangaList={shuffle<Comic>([...topAllManga].slice(0, 15))}
                />

                <Section
                    link={`/${MANGA_BROWSE_PAGE}?view=newComic`}
                    title="M???i c???p nh???t"
                    style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden"
                    linkHints={true}
                >
                    <SectionSwiper mangaList={comicsNewUpdated?.comics} />
                </Section>

                <Section
                    title={showRecommendedComics ? 'C???ng ?????ng B??nh Ch???n' : ''}
                    arrowTrendingUp
                    style="h-fit w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden text-white"
                >
                    {!showRecommendedComics && (
                        <div className="absolute-center h-28 w-full ">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 55,
                                }}
                                className="absolute-center h-4/5 w-[65%] rounded-lg border-2 border-white/40 px-4 md:w-96"
                            >
                                <h4 className="whitespace-nowrap">
                                    Hi???n th??? b??nh ch???n
                                </h4>
                                <ToggleButton
                                    handleToggle={
                                        handleToggleShowRecommendedComics
                                    }
                                />
                            </motion.div>
                        </div>
                    )}

                    {showRecommendedComics && (
                        <RecommendedComics
                            comics={recommendedComics}
                            handleShowSection={
                                handleToggleShowRecommendedComics
                            }
                        />
                    )}
                </Section>

                <Section
                    title={`Comics M??a ${calculateSeason()}`}
                    style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden"
                >
                    <SeasonalComics comics={seasonalComics} />
                </Section>

                <Section style="w-[90%] mx-auto w-max-[1300px] mt-6 overflow-x-hidden">
                    <RandomComics />
                </Section>

                <Section style="w-[90%] mx-auto min-w-[333px] w-max-[1300px] mt-6 overflow-x-hidden">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <ColumnSection
                            mangaList={[...topAllManga].slice(0, 5)}
                            title="Manga n???i b???t nh???t"
                            link={`/${MANGA_BROWSE_PAGE}?comics=manga-112&view=all`}
                        />
                        <ColumnSection
                            mangaList={[...topMonthManga].slice(0, 5)}
                            title="Manga n???i b???t th??ng"
                            link={`/${MANGA_BROWSE_PAGE}?comics=manga-112&view=month`}
                        />
                        <ColumnSection
                            mangaList={[...topWeekManga].slice(0, 5)}
                            title="Manga n???i b???t tu???n"
                            link={`/${MANGA_BROWSE_PAGE}?comics=manga-112&view=week`}
                        />
                        <ColumnSection
                            mangaList={[...topDayManga].slice(0, 5)}
                            title="Manga n???i b???t ng??y"
                            link={`/${MANGA_BROWSE_PAGE}?comics=manga-112&view=day`}
                        />
                    </div>
                </Section>

                <Section
                    link={`/${MANGA_BROWSE_PAGE}?view=new`}
                    title="Truy???n m???i"
                    style="w-[90%] mx-auto w-max-[1300px] mt-6  overflow-x-hidden"
                    linkHints={true}
                >
                    <SectionSwiper mangaList={comicsNewRelease?.comics} />
                </Section>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const { db } = await connectToDatabase();

    const [resultAll, resultMonth, resultWeek, resultDay, resultSeason] =
        await Promise.all([
            db.collection('real_time_comics').findOne({ type: 'all' }),
            db.collection('real_time_comics').findOne({ type: 'month' }),
            db.collection('real_time_comics').findOne({ type: 'week' }),
            db.collection('real_time_comics').findOne({ type: 'day' }),
            db.collection('real_time_comics').findOne({ type: 'season' }),
        ]);

    const { comics: topAllManga } = resultAll;
    const { comics: topMonthManga } = resultMonth;
    const { comics: topWeekManga } = resultWeek;
    const { comics: topDayManga } = resultDay;
    const { comics: seasonalComics } = resultSeason;

    return {
        props: {
            topAllManga: JSON.parse(JSON.stringify(topAllManga)),
            topMonthManga: JSON.parse(JSON.stringify(topMonthManga)),
            topWeekManga: JSON.parse(JSON.stringify(topWeekManga)),
            topDayManga: JSON.parse(JSON.stringify(topDayManga)),
            seasonalComics: JSON.parse(JSON.stringify(seasonalComics)),
        },
        revalidate: REVALIDATE_TIME,
    };
};

export default Home;
