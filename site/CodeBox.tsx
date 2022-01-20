import React from 'react';

class CodeBox extends React.Component {
    render() {
        return (
            <div className="code-box">
                {this.props.children}
            </div>
        )
    }
}

export default CodeBox;