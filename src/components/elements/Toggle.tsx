/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const toggleBlock = css`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const toggleLayout = css`
    width: 56px;
    height: 32px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-right: 20px;
`;

export type ToggleProps = {
    id: string;
    label: string;
    value: boolean;
    onChange: (newValue: boolean) => void;
};

export const Toggle = (props: ToggleProps) => {
    const { id, label, value, onChange } = props;
    return (
        <div css={toggleBlock}>
            <div css={toggleLayout}>
                <input
                    className="on-off-toggle__input"
                    type="checkbox"
                    id={`toggle_switch_${id}`}
                    checked={value}
                    onChange={(e) => {
                        onChange(e.target.checked);
                    }}
                />
                <label
                    className="on-off-toggle__slider"
                    htmlFor={`toggle_switch_${id}`}
                ></label>
            </div>
            <span>{label}</span>
        </div>
    );
};
