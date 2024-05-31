"use client"

import ProgressBar from "@ramonak/react-progress-bar";
import React, { useEffect, useState } from "react";
import { Steps, Step } from 'intro.js-react';
import 'intro.js/introjs.css';

interface InfoBarProps {
    userProgress: {
        progress: number;
        length: number;
    },
    title: string,
    subtitle: string,
    lessonConfig: {
        steps: Step[]
    }
}

const LessonInfoBar = ({ userProgress, title, subtitle, lessonConfig }: InfoBarProps) => {

    const [isActive, setIsActive] = useState<boolean>(true);
    const [currentStep, setCurrentStep] = useState<number>(Math.max(userProgress.progress-1, 0));
    const [isStepsActive, setIsStepsActive] = useState<boolean>(false);
    const [currentSection, setCurrentSection] = useState<string>(lessonConfig.steps[Math.max(userProgress.progress-1, 0)].title?.toString() ?? 'Error');

    const [csrfToken, setCsrfToken] = useState<string>('Loading...');
  
    useEffect(() => {
        const el = document.querySelector('meta[name="x-csrf-token"]') as HTMLMetaElement | null;
        if (el) setCsrfToken(el.content);
        else setCsrfToken('missing');
        setTimeout(() => setIsStepsActive(true), 1000);
    }, []);

    const { length } = userProgress;

    return (
        <div>
        {
        isActive
        ?
            (<div className="flex justify-around items-center py-8">

                <div className="flex flex-col items-start bg-sky-600 p-2 px-10 rounded-2xl shadow-xl text-white">
                    <h1 className="text-5xl pb-2"> { title }  </h1>
                    <p className="text-base"> { subtitle }  </p>
                </div>

                <Steps
                    enabled={isStepsActive}
                    steps={lessonConfig.steps}
                    initialStep={currentStep}
                    onExit={() => setIsStepsActive(false)}
                    onAfterChange={(newIndex) => {
                        setCurrentStep(newIndex);
                        setCurrentSection(lessonConfig.steps[newIndex].title?.toString() ?? 'Error');
                        fetch('/api/webinfo/updateProgress', {
                            headers: { 'X-CSRF-Token': csrfToken },
                            method: 'POST',
                            body: JSON.stringify({ lessonId: 1, newProgress: newIndex+1}),
                          });
                    }}
                    options={
                        {
                            showStepNumbers: true,
                            tooltipClass: "!max-w-2xl w-96"
                        }
                    }
                />

                <div className="space-x-1.5 self-end">
                    <button className="w-fit h-fit" onClick={() => {setIsActive(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0284C7" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                        </svg>
                    </button>
                    <button className="w-fit h-fit" onClick={() => {
                        setCurrentStep(0);
                        setIsStepsActive(true);
                        fetch('/api/webinfo/updateProgress', {
                            headers: { 'X-CSRF-Token': csrfToken },
                            method: 'POST',
                            body: JSON.stringify({ lessonId: 1, newProgress: 0}),
                          });
                        }}>
                        <svg fill="#ffffff" height="32" width="32" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-6.4 -6.4 76.80 76.80" enableBackground="new 0 0 64 64" stroke="#ffffff" strokeWidth="1.5">
                            <rect x="-6.4" y="-6.4" width="76.80" height="76.80" rx="38.4" fill="#0284C7" strokeWidth="0"/>
                            <path d="M63.6213341,25.8802509c-0.436676-0.3509007-1.0704994-0.2780018-1.418499,0.1566982l-2.9656982,3.7034016 C58.1400375,15.5829496,46.2772369,4.3959498,31.8423367,4.3959498c-12.8505993,0-23.8588982,8.7292995-26.7686806,21.2279987 c-0.1272187,0.5432014,0.2108812,1.0853004,0.7540002,1.2115002c0.5401812,0.1291008,1.084281-0.2109985,1.2114811-0.7540989 C9.7359371,14.5023499,19.9350376,6.41465,31.8423367,6.41465c13.3769016,0,24.3693981,10.3680992,25.3831997,23.4885998 l-3.3961983-3.0539989c-0.4150009-0.3726006-1.0516815-0.3390999-1.4253006,0.0748997 c-0.3736,0.414999-0.3390999,1.0527,0.0748978,1.4252987l5.2853012,4.7521019 c0.1862984,0.1674995,0.4267998,0.2591972,0.6752014,0.2591972c0.0275993,0,0.0552177-0.0009995,0.082798-0.0029984 c0.276001-0.0225983,0.5312996-0.158699,0.7047997-0.3754997l4.5509987-5.6835995 C64.1269379,26.8639507,64.0569382,26.2282505,63.6213341,25.8802509z"/> <path d="M58.1723366,37.1645508c-0.5411987-0.1320992-1.0853004,0.2109985-1.2113991,0.7541008 C54.2640343,49.4976501,44.0649376,57.58535,32.1577377,57.58535c-13.3770008,0-24.3694992-10.3680992-25.3833008-23.4886017 l3.3962188,3.0540009c0.415,0.3726006,1.0527811,0.3411026,1.4253807-0.0748978 c0.3734999-0.4150009,0.3390007-1.0527-0.0749998-1.4253006l-5.2852998-4.7521 c-0.2069998-0.1863003-0.4790001-0.2740002-0.7579999-0.2563c-0.276,0.0226994-0.5313001,0.158699-0.7048001,0.3755989 l-4.5509,5.6834984c-0.349,0.4347-0.279,1.0705032,0.1567,1.4185028c0.1863,0.1497993,0.409,0.2216988,0.6298,0.2216988 c0.2967,0,0.5895-0.1291008,0.7886-0.3784981l2.9656999-3.7034035 c1.0970998,14.1575012,12.9598989,25.3445015,27.3949013,25.3445015c12.8505974,0,23.8589172-8.7294006,26.7686996-21.2280998 C59.0535355,37.8328514,58.715435,37.2907486,58.1723366,37.1645508z"/>
                        </svg>
                    </button>
                    <button id="helpBtn" className="w-fit h-fit" onClick={() => setIsStepsActive(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0284C7" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
                    </svg>
                    </button>
                </div>

                <div>
                    <div className="mb-5 h-5 rounded-full bg-gray-200">
                        <ProgressBar completed={Math.floor(((currentStep+1)/length) * 100)} bgColor="#0284C7" initCompletedOnAnimation={0}/>
                    </div>

                    <div className="flex flex-col items-start bg-sky-600 py-5 px-10 w-96 rounded-2xl shadow-xl text-white">
                        <p className="text-base"> Current Section: { currentSection }  </p>
                    </div>
                </div>

            </div>)

        :

            (<div className="flex justify-center py-4"> 

                    <button className="w-fit h-fit" onClick={() => {setIsActive(true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0284C7" className="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                    </svg>
                    </button>

            </div>)
        }
        </div>
    )
}

export default LessonInfoBar;