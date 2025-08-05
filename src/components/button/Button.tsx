import { ReactNode } from "react";
import "./Button.scss";

export type ButtonComponentProps = {
    onClick?: () => void;
    children?: ReactNode;
    icon?: ReactNode;
};

function ButtonComponent(props: ButtonComponentProps) {
    const { onClick, children, icon } = props;
    return (
        <div className="button-component" onClick={onClick}>
            <span className="icon">{icon}</span>
            {children}
        </div>
    );
}

export default ButtonComponent;
