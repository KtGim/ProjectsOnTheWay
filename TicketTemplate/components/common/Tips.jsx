import React, { PureComponent } from 'react';
import { preventFunc } from '../OperationBar/const';

class Tips extends PureComponent {

    leave = () => {
        const { handleConfirm } = this.props;
        if(handleConfirm) {
            setTimeout(() => {
                handleConfirm(false);
            }, 3000);
        }
    }

    confirm = (sure, e) => {
        preventFunc(e);
        const { handleConfirm } = this.props;
        handleConfirm && handleConfirm(sure);
    }

    render() {
        const { children, okTxt, cancelTxt } = this.props;
        const showFooter = okTxt || cancelTxt;
        return <div
            className="tips"
            onMouseLeave={showFooter ? undefined: this.leave}
        >
            {children}
            {
                showFooter && <div className="tips_footer">
                    {cancelTxt && <div className="cancel" onClick={this.confirm.bind(this, false)}>{cancelTxt}</div>}
                    {okTxt && <div className="ok" onClick={this.confirm.bind(this, true)}>{okTxt}</div>}
                </div>
            }
        </div>;
    }
}

export default Tips;