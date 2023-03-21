import React, {useEffect, useMemo, useState} from 'react';

function useInterval(callback: Function, delay: number | null) {
    useEffect(() => {
        if (delay !== null) {
            const interval = setInterval(() => {
                callback()
            }, delay || 0)
            return () => clearInterval(interval)
        }
    }, [callback, delay])
}

type TimerItem = {
    name: string
    seconds: number
}

type CurrentTimer = {
    index: number
    remainingSeconds: number
}

const timerItems: TimerItem[] = [
    {name: '作業', seconds: 1500},
    {name: '短休憩', seconds: 300},
    {name: '作業', seconds: 1500},
    {name: '短休憩', seconds: 300},
    {name: '作業', seconds: 1500},
    {name: '短休憩', seconds: 300},
    {name: '作業', seconds: 1500},
    {name: '長休憩', seconds: 900},
]

function App() {
    const [timer, setTimer] = useState<CurrentTimer>({
        index: 0,
        remainingSeconds: timerItems[0].seconds,
    })
    const remainingTime = useMemo(
        () => {
            const minutes = Math.floor(timer.remainingSeconds / 60).toString().padStart(2, '0')
            const seconds = (timer.remainingSeconds % 60).toString().padStart(2, '0')
            return `${minutes}:${seconds}`
        },
        [timer]
    )

    const [timerRunning, setTimerRunning] = useState(false)
    const timerButtonLabel = useMemo(
        () => timerRunning ? 'ストップ' : 'スタート',
        [timerRunning]
    )

    const [alarmRinging, setAlarmRinging] = useState(false)
    const alarmStopButtonDisabled = useMemo(
        () => !alarmRinging,
        [alarmRinging]
    )

    useInterval(() => {
        if (timer.remainingSeconds === 0) {
            const nextIndex = (timer.index + 1) % timerItems.length
            setTimer({
                index: nextIndex,
                remainingSeconds: timerItems[nextIndex].seconds,
            })
            setAlarmRinging(true)
        } else {
            setTimer({
                ...timer,
                remainingSeconds: timer.remainingSeconds - 1,
            })
        }
    }, timerRunning ? 1000 : null)

    return (
        <div>
            <h1>{remainingTime}</h1>
            <button onClick={() => setTimerRunning(!timerRunning)}>{timerButtonLabel}</button>
            <button onClick={() => setAlarmRinging(false)} disabled={alarmStopButtonDisabled}>アラーム停止</button>
            <table>
                <thead>
                <tr>
                    <th colSpan={2}>ポモドーロ・メニュー</th>
                </tr>
                <tr>
                    <th>メニュー</th>
                    <th>時間（min）</th>
                    <th>起動中</th>
                </tr>
                </thead>
                <tbody>
                {timerItems.map((t, i) => (
                    <tr key={i}>
                        <td>{t.name}</td>
                        <td>{t.seconds / 60}</td>
                        <td>{i === timer.index ? 'YES' : 'NO'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
