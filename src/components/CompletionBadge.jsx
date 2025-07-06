import { Badge } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

const CompletionBadge = ({ completed }) => {
    if (completed) {
        return <CheckCircleFill color="green" size={18} />;
    }
    return <></>;
};

export default CompletionBadge;
