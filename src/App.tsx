import React, {useEffect, useMemo, useState} from 'react';

const mtos = (minutes: number) => minutes * 60;
const stoms = (seconds: number) => seconds * 1000;

type TimerItem = {
    name: string
    seconds: number
}

const timerItems: TimerItem[] = [
    {name: '作業', seconds: mtos(25)},
    {name: '短休憩', seconds: mtos(5)},
    {name: '作業', seconds: mtos(25)},
    {name: '短休憩', seconds: mtos(5)},
    {name: '作業', seconds: mtos(25)},
    {name: '短休憩', seconds: mtos(5)},
    {name: '作業', seconds: mtos(25)},
    {name: '長休憩', seconds: mtos(15)},
]

function Button({children, className, disabled, onClick}: {
    children?: React.ReactNode
    className?: string
    disabled?: boolean
    onClick: () => void
}) {
    return <button
        className={[
            className,
            (disabled ? "bg-neutral-500" : "bg-neutral-200 hover:bg-neutral-300")
        ].join(' ')}
        disabled={disabled}
        onClick={onClick}>{children}</button>
}

function App() {
    const [timerIndex, setTimerIndex] = useState(0)
    const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(timerItems[0].seconds)
    const [timerRunning, setTimerRunning] = useState(false)
    const [alarmRinging, setAlarmRinging] = useState(false)

    const remainingTime = useMemo(
        () => {
            const minutes = Math.floor(timerRemainingSeconds / 60).toString().padStart(2, '0')
            const seconds = (timerRemainingSeconds % 60).toString().padStart(2, '0')
            return `${minutes}:${seconds}`
        },
        [timerRemainingSeconds]
    )
    const timerButtonLabel = useMemo(
        () => timerRunning ? 'ストップ' : 'スタート',
        [timerRunning]
    )
    const alarmStopButtonDisabled = useMemo(
        () => !alarmRinging,
        [alarmRinging]
    )

    const handleTimerButtonClick = () => {
        setTimerRunning(!timerRunning)
    }

    const handleAlarmStopButtonClick = () => {
        setAlarmRinging(false)
    }

    useEffect(() => {
        if (timerRunning) {
            const timeout = setTimeout(() => {
                if (timerRemainingSeconds <= 0) {
                    setTimerIndex((timerIndex + 1) % timerItems.length)
                    setTimerRemainingSeconds(timerItems[timerIndex + 1].seconds)
                    setAlarmRinging(true)
                } else {
                    setTimerRemainingSeconds(timerRemainingSeconds - 1)
                }
            }, stoms(1))
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [timerIndex, timerRemainingSeconds, timerRunning])

    useEffect(() => {
        if (alarmRinging) {
            const audio = new Audio('/sound/coo.mp3');
            audio.loop = true
            audio.play()

            const timeout = setTimeout(() => {
                setAlarmRinging(false)
            }, stoms(10))

            return () => {
                audio.pause()
                clearTimeout(timeout)
            }
        }
    }, [alarmRinging])

    return (
        <div className={"container mx-auto my-20"}>
            <div className={"m-10 text-center text-7xl"}>{remainingTime}</div>
            <div className={"m-10 grid grid-cols-1 place-items-center space-y-5 text-3xl"}>
                <Button className={"w-36 h-14"} onClick={handleTimerButtonClick}>{timerButtonLabel}</Button>
                <Button className={"w-52 h-14"} onClick={handleAlarmStopButtonClick}
                        disabled={alarmStopButtonDisabled}>アラーム停止</Button>
            </div>
            <div className={"container w-96 mx-auto my-10"}>
                <div className={"w-80 mx-auto my-10 grid grid-cols-2 place-items-center gap-2"}>
                    <div className={"w-full col-span-2 grid grid-cols-1 place-items-center gap-2 text-2xl"}>
                        <div>ポモドーロ・メニュー</div>
                    </div>
                    <div className={"w-full col-span-2 grid grid-cols-2 place-items-center gap-2"}>
                        <div className={"col-span-1 text-xl"}>メニュー</div>
                        <div className={"col-span-1 text-xl"}>時間（min）</div>
                    </div>
                    {timerItems.map((t, i) => (
                        <div key={i}
                             className={`w-full col-span-2 grid grid-cols-2 place-items-center gap-2 ${i === timerIndex ? "bg-amber-200 font-bold" : ""}`}>
                            <div className={"col-span-1 text-lg"}>{t.name}</div>
                            <div className={"col-span-1 text-lg"}>{t.seconds / 60}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
