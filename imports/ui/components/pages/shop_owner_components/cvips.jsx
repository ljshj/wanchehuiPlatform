import React, { Component } from 'react';
import { Table, Tooltip, Button, message, Modal, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import {  setCommonCard } from '../../../actions/vips';

class Cvips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            common_vips: [],
            visible: false,
            data: [],
            common_card_id: '',
            common_card_name: '',
            totalCount: 1000,
            currentPage: 1,
            members: [],
        }
    }
    componentDidMount() {
        let self = this
        const { dispatch } = this.props;
        let userId = Meteor.userId()
        console.log(userId)
        let shopId = ''
        Meteor.call('shops.getByCurrentUser', userId, function (err, rlt) {
            if (!err) {
                shopId = rlt._id
                console.log(shopId)
                let condition2 = { shopId: shopId, productClass: 'common_card' }
                Meteor.call('get.product.vipcard.byShopId', condition2, function (err, rlt) {
                    if (!err) {
                        dispatch(setCommonCard(rlt))
                        self.setState({
                            common_card_name: rlt.name_zh,
                            common_card_id: rlt._id
                        })
                        Meteor.call('get.vips.count', rlt._id, function (err, rlt) {
                            if (!err) {
                                self.setState({
                                    totalCount: rlt
                                })
                            }
                        })
                        self.getPageCommonVips(rlt._id, 1, 5)
                    }
                })
            }
        })
    }

    getPageCommonVips(productId, page, pageSize) {
        let self = this;
        Meteor.call("get.commonCard.product.users", productId, page, pageSize, function (error, result) {
            if (!error) {
                console.log(result)
                self.setState({
                    common_vips: result,
                    currentPage: page,
                })
            }
        })
    }

    handlePageChangeCommonVips(page, pageSize) {
        $(document).scrollTop(0);
        this.getPageCommonVips(this.state.common_card_id, page, pageSize);
    }

    render() {
        
        const common_columns = [{
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '手机号码',
            dataIndex: 'profile.mobile',
            key: 'profile.mobile',
        }, {
            title: '上级',
            dataIndex: 'superior',
            key: 'superior',
        }, {
            title: '总订单数量',
            dataIndex: 'orders_count',
            key: 'orders_count',
        }, {
            title: '总收入',
            dataIndex: 'all_income',
            key: 'all_income',
            render: (text, record) => {
                return (record.all_income / 100)
            }
        },
        {
            title: '已提现',
            dataIndex: 'withdraw_count',
            key: 'withdraw_count',
            render: (text, record) => {
                return (record.withdraw_count / 100)
            }
        }, {
            title: '账户余额',
            dataIndex: 'balance',
            key: 'balance',
            render: (text, record) => {
                return (record.balance / 100)
            }
        }, {
            title: '操作',
            key: 'show',
            render: (text, record) => (
                <span>
                    <Tooltip placement="topLeft" title="授卡" arrowPointAtCenter>
                        <Button shape="circle" onClick={() => this.giveItToUser(record._id)} icon="user-add" />
                    </Tooltip>
                </span>
            ),
        }];
        const common_vips = this.state.common_vips
        return (
            <div>
                <h2>{this.state.common_card_name}会员</h2>
                <Table
                    columns={common_columns}
                    dataSource={common_vips}
                    rowKey='_id'
                    pagination={{
                        defaultPageSize: 5, total: this.state.totalCount,
                        onChange: (page, pageSize) => this.handlePageChangeCommonVips(page, pageSize),
                        showQuickJumper: true, current: this.state.currentPage
                    }} />
            </div>)
    }
}

function mapStateToProps(state) {
    return {
        advancedCard: state.VipCards.advancedCard,
        commonCard: state.VipCards.commonCard,
        CurrentDealUser: state.CurrentDealUser
    };
}

export default connect(mapStateToProps)(Cvips);