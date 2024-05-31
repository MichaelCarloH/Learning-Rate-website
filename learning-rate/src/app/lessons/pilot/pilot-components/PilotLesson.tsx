"use client"

import React, { useState } from "react";
import LessonInfoBar from "../../lesson-components/lesson_info_bar";
import Playground from "@/app/playground/playground";
import PilotSteps from "./PilotSteps";
import 'intro.js/introjs.css';

interface PilotProps { 
    datasets: {
        trainingSetID: number;
        setName: string;
        inputWidth: number;
        outputWidth: number;
    }[],
    userProgress: {
        progress: number;
        length: number;
    }
}

const Pilot = ({ datasets, userProgress }: PilotProps) => {

    return (
        <div>

                <LessonInfoBar 
                    userProgress={userProgress}
                    title="Pilot"
                    subtitle="An introduction to Learning Rate"
                    lessonConfig={{steps: PilotSteps}}
                />

                <Playground 
                    isFPBtnVisible = {true}
                    isHyperParamsVisible = {true}
                    isSelectionBoxVisible = {true}
                    isTrainBtnsVisible = {true}
                    isTrainLossVisible = {true}
                    isTrainingVisible = {true}
                    trainingSets= {datasets}
                />

        </div>
    )
}

export default Pilot;