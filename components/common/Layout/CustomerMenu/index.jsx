import React from 'react';
import { Menu } from 'antd';

class CustomerMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            barElement: null,
            menuElement: null,
            currentClickDom: null,
            rendered: false,
            style: {}
        };
    }

    static getDerivedStateFromProps(_, prevState) {
        if(!prevState.rendered && !prevState.barElement && !prevState.menuElement) {
            const barElement = document.querySelector('.wmstool-tabs-bar');
            const menuElement = document.querySelector('.customer-menu');
            if(barElement && menuElement) {
                return {
                    menuElement,
                    barElement
                };
            }
        }
    }

    componentDidUpdate() {
        const { barElement, menuElement, rendered } = this.state;
        if(!rendered && barElement && menuElement) {
            this.renderCustomerMenu(barElement, menuElement);
        }
    }

    componentWillUnmount() {
        const { menuElement, barElement } = this.state;
        barElement.removeEventListener('mousedown', this.menuShow);
        menuElement.removeEventListener('mouseleave', this.menuHide);
    }

    // 优化 tab 页面的功能
    renderCustomerMenu = (barElement, menuElement) => {
        barElement.addEventListener('mousedown', this.menuShow);
        menuElement.addEventListener('mouseleave', this.menuHide);
        // menusElement.onmousedown = function(e){
        //     console.log(e.button);
        // };
    }

    menuShow = (e) => {
        if(this.state.show) {
            return;
        }
        this.setState({
            show: e.button == 2,
            style: {
                left: e.clientX - 5,
                top: e.clientY - 5
            },
            currentClickDom: e.target
        });
        if(e.button == 2) {
            document.oncontextmenu = () => {
                return false;
            };
        }
    }

    menuHide = () => {
        this.setState({
            show: false,
            currentClickDom: null
        });
        document.oncontextmenu = () => {
            return true;
        };
    }

    render() {
        const { show, style, currentClickDom } = this.state;
        const { RightClickMenu, menuClick } = this.props;
        return (
            <div style={style} className={`customer-menu ${show ? 'show' : 'hide'}`}>
                <Menu onClick={(e) => { menuClick({...e, tabDom: currentClickDom }); }}>
                    {
                        RightClickMenu.map(({key, label}) => <Menu.Item key={key}>{label}</Menu.Item>)
                    }
                </Menu>
            </div>
        );
    }
}

export default CustomerMenu;