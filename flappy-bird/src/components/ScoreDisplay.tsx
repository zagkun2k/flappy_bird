interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="text-2xl font-semibold mb-4">
      Score: {score}
    </div>
  );
};

export default ScoreDisplay;