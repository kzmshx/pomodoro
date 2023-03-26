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
        <div>
            <h1>{remainingTime}</h1>
            {alarmRinging && <h1>Ringing</h1>}
            <button onClick={handleTimerButtonClick}>{timerButtonLabel}</button>
            <button onClick={handleAlarmStopButtonClick} disabled={alarmStopButtonDisabled}>アラーム停止</button>
            <table>
                <thead>
                <tr>
                    <th colSpan={2}>ポモドーロ・メニュー</th>
                </tr>
                <tr>
                    <th>メニュー</th>
                    <th>時間（min）</th>
                </tr>
                </thead>
                <tbody>
                {timerItems.map((t, i) => (
                    <tr key={i} style={{fontWeight: i === timerIndex ? 'bold' : 'normal'}}>
                        <td>{t.name}</td>
                        <td>{t.seconds / 60}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
