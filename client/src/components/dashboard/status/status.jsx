import { useAlcCalc } from '/src/hooks/useAlcCalc'

export default function Status({ userData }) {
    const { calcIntox } = useAlcCalc();
    const { currentBAC, hoursToSober, totalAlcoholMl } = calcIntox(userData);

    return (
        <div>
        <p>Pure alcohol consumed: {totalAlcoholMl} ml</p>
        <p>Estimated BAC: {currentBAC}%</p>
        <p>Estimated time to sober: {hoursToSober} hours</p>
        </div>
    );
}