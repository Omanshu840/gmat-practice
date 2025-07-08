import { CheckCircleFill } from "react-bootstrap-icons";

const CompletionBadge = ({ completed }) => {
    if (completed) {
        return <CheckCircleFill className="check-icon" color="green" size={18} />;
    }
    return <></>;
};

export default CompletionBadge;
