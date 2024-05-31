import Card from "./lesson-components/lesson_card";
import { getCurrentUserLessonProgress } from "@/data/user-dto";
import { auth } from "@/auth";

export default async function Home(){
    const session = await auth();

    // uses fetch, so cached, no need to continuously request the lesson info
    // explained on nextjs docs under caching (data cache)
    const lessonsJSON = await fetch(`${process.env.URL}/api/webinfo/lessons`, { next: { revalidate: 1 * 60 * 60 } });
    const lessons: {
        lessonID: number;
        lessonTitle: string;
        lessonTag: string;
        lessonDescription: string;
        lessonImg: string;
        lessonLength: number;
        lessonLink: string;
        isLocked: number;
    }[] = await lessonsJSON.json();

    const progressesRaw = await Promise.all(lessons.map(lesson => getCurrentUserLessonProgress(session, lesson.lessonID)));
    
    const progresses = progressesRaw.map(progress => progress == null ? { progress: 0, length: 1} : progress);

    return (
        <main className="flex flex-wrap flex-row justify-center gap-8 m-8">

            { lessons.map( (lesson, i) => (<Card
                key={i}
                title={lesson.lessonTitle}
                tag={lesson.lessonTag}
                text={lesson.lessonDescription}
                progress={progresses[i].progress}
                length={progresses[i].length}
                imgLink={lesson.lessonImg}
                isLocked={lesson.isLocked}
                lessonLink={lesson.lessonLink}
            />) ) }


        </main>
    );

}
