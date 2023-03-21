import React, {useState} from 'react';
import {match} from "ts-pattern";

type TimerItem = {
    name: string
    seconds: number
    active: boolean
}

const defaultTimerItems: TimerItem[] = [
    {name: '作業', seconds: 1500, active: false},
    {name: '短休憩', seconds: 300, active: false},
    {name: '作業', seconds: 1500, active: false},
    {name: '短休憩', seconds: 300, active: false},
    {name: '作業', seconds: 1500, active: false},
    {name: '短休憩', seconds: 300, active: false},
    {name: '作業', seconds: 1500, active: false},
    {name: '長休憩', seconds: 900, active: false},
]

const TimerButtonMode = {
    START: 'start',
    STOP: 'stop',
} as const

type TimerButtonMode = typeof TimerButtonMode[keyof typeof TimerButtonMode]


function App() {
    const [timerItems, setTimerItems] = useState<TimerItem[]>(defaultTimerItems)
    const [timerButtonMode, setTimerButtonMode] = useState<TimerButtonMode>(TimerButtonMode.START)
    const timerButtonLabel = match(timerButtonMode)
        .with(TimerButtonMode.START, (): string => 'スタート')
        .with(TimerButtonMode.STOP, (): string => 'ストップ')
        .exhaustive()
    const [alarmStopButtonDisabled, setAlarmStopButtonDisabled] = useState(true)

    const handleTimerButtonClick = () => {
        if (timerButtonMode === TimerButtonMode.START) {
            setTimerButtonMode(TimerButtonMode.STOP)
        } else if (timerButtonMode === TimerButtonMode.STOP) {
            setTimerButtonMode(TimerButtonMode.START)
        } else {
            throw new Error('Unknown timer button mode')
        }
    }

    const handleAlarmStopButtonClick = () => {
        setAlarmStopButtonDisabled(true)
    }

    return (
        <div>
            <h1>23:45</h1>
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
                {timerItems.map((timer, index) => (
                    <tr key={index}>
                        <td>{timer.name}</td>
                        <td>{timer.seconds / 60}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
