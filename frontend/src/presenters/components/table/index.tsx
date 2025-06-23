import React, { Component, JSX } from 'react'
import loadingIcon from '../../../assets/icons/reload-icon.svg'
import './styles.sass'

class Table extends Component<{
    header: any,
    body: (data: any[]) => JSX.Element[],
    data: any[],
    total: number,
    offset: number,
    limit: number,
    loading?: boolean,
    onNavigate?: ({ page, offset }: { page: number, offset: number }) => void
}> {

    state: Record<string, any> = {
        page: 1,
        allPages: [],
        shownPages: []
    }

    setElements = () => {
        if (this.props.total <= this.props.limit || this.props.total === 0) {
            this.setState({ 
                page: 1,
                allPages: [],
                shownPages: []
            });

            return
        };

        const allPages = Array.from(Array(Math.ceil(this.props.total/this.props.limit)).keys()).map((x, i) => ({ page: x + 1, offset: i * 10 }));
        
        this.setState({ 
            page: allPages.filter(x => x.offset === this.props.offset)[0].page,
            allPages
        }, () => {

            setTimeout(() => {
                let startSlice = 0;

                if (this.state.page < 5) {
                    if (this.state.page % 10 !== 0) {
                        startSlice = this.state.page - (this.state.page % 10)
                    } else {
                        startSlice = this.state.page - 1;
                    };
                    
                } else {
                    startSlice = this.state.page - 5;
                };

                const shownPages = allPages.slice(
                                    startSlice,
                                    startSlice + 10
                                );

                this.setState({shownPages});
            });
        });
    }

    componentDidMount() {
        if (!this.props.loading) {
            this.setElements();
        };
    }

    componentDidUpdate(prevProps: Readonly<{ header: any; body: (data: any[]) => JSX.Element[]; data: any[]; total: number; offset: number; limit: number; loading?: boolean; onNavigate?: ({ offset }: { offset: number }) => void; }>, prevState: Readonly<{}>, snapshot?: any): void {
        const table = document.querySelector('.table') as HTMLElement;

        if (this.props.loading) {
            table.style.pointerEvents = 'none';
        } else {
            table.style.pointerEvents = 'inherit';
        };
        
        if (prevProps.loading !== this.props.loading && !this.props.loading) {
            this.setElements();
        };
    }

    render() {
        return (
            <div className='table'>
                <table cellSpacing={0}>
                    {this.props.header}
                    <tbody>
                        {
                            this.props.loading &&
                            <tr>
                                <td colSpan={100}>
                                    <div className='loading'>
                                        <img src={loadingIcon} alt='loading-con' />
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            !this.props.loading && this.props.data.length === 0 &&
                            <tr>
                                <td colSpan={100}>
                                    <div>
                                        <p>Nenhum item encontrado</p>
                                    </div>
                                </td>
                            </tr>
                        }
                        {
                            !this.props.loading && this.props.data.length > 0 &&
                            this.props.body(this.props.data)
                        }
                    </tbody>
                </table>
                <div className='paginator noselect'>
                    {
                        this.state.page > 1 &&
                        <>
                            <span 
                            onClick={() => {
                                this.props.onNavigate && this.props.onNavigate({
                                    offset: 0,
                                    page: 1
                                });
                            }}>{'<<'}</span>
                            <span 
                            onClick={() => {
                                this.props.onNavigate && this.props.onNavigate({
                                    page: this.state.page - 1,
                                    offset: this.props.offset - this.props.limit
                                });
                            }}>{'<'}</span>
                        </>
                    }
                    {
                        this.state.shownPages.map((x: any, i: number) => 
                        <span
                        key={'page_'+i}
                        className={'page-index '+(this.state.page === x.page ? 'selected' : '')}
                        onClick={() => {
                            this.props.onNavigate && this.props.onNavigate({
                                page: x.page,
                                offset: x.offset
                            });
                        }}>{x.page}</span>)
                    }
                    {
                        this.state.page < this.state.allPages.length &&
                        <>
                            <span 
                            onClick={() => {
                                this.props.onNavigate && this.props.onNavigate({
                                    offset: this.props.offset + this.props.limit,
                                    page: this.state.page + 1
                                });
                            }}>{'>'}</span>
                            <span 
                            onClick={() => {
                                this.props.onNavigate && this.props.onNavigate({
                                    offset: this.state.allPages[this.state.allPages.length - 1].offset,
                                    page: this.state.allPages[this.state.allPages.length - 1].page
                                });
                            }}>{'>>'}</span>
                        </>
                    }
                </div>
            </div>
        )
    }
}

export default Table
