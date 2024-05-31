import { auth } from "@/auth";
import { getCurrentUserLessonProgress } from "@/data/user-dto";
import Pilot from "./pilot-components/PilotLesson";


export default async function PilotLesson() {

    const datasetsJSON = await fetch(`${process.env.URL}/api/webinfo/datasets`, { next: { revalidate: 1 * 60 * 60 } });

    const datasets: {
        trainingSetID: number;
        setName: string;
        inputWidth: number;
        outputWidth: number;
    }[] = await datasetsJSON.json();

    const session = await auth();
    const lessonProgress = await getCurrentUserLessonProgress(session, 1);

    return (
        <main >

            <Pilot
            datasets={datasets}
            userProgress={lessonProgress ?? { progress: 0, length: 1} }
            />    
            
        </main>
    );
}

