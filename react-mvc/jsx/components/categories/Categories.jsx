﻿

define([
    'react',
    'jsx!categories/Category',
    'jsx!CRUD/Create',
    'jsx!CRUD/CRUDRedux'
],
function (React, Category, Create, CRUDRedux) {

    var Categories = React.createClass({
        getInitialState: function () {
            return {
                modalOptions: {
                    buttonText: 'Create new category'
                },
                inputs: [{
                    label: 'Name',
                    name: 'categoryName',
                    jsonName: 'name',
                    type: 'text',
                    placeholder: 'type a category name',
                    wrapperClassName: 'small-12 columns',
                    required: true,
                    errorMessage: 'Name is missing or to short!',
                    regex: '[a-zA-Z]{4}'
                },
                {
                    label: 'Description',
                    name: 'categoryDescription',
                    jsonName: 'description',
                    type: 'textarea',
                    wrapperClassName: 'small-12 columns',
                    required: true,
                    errorMessage: 'Description is missing!'
                },
                {
                    label: 'Target Group',
                    name: 'targetGroup',
                    jsonName: 'targetGroup',
                    type: 'select',
                    alternatives: ['Children', 'Young Adults', 'Adults', 'Seniors'],
                    defaultValue: null,
                    value: null,
                    placeholder: 'Pick a target group',
                    wrapperClassName: 'small-12 columns',
                    required: true,
                    errorMessage: 'You must select a target group!'
                }],
                buttons: [{
                    name: 'Create',
                    action: (event, inputs) => CRUDRedux.dispatch({ type: 'CREATE', event: event, inputs: inputs }),
                    clearFormAfterAction: true,
                    closeModalAfterAction: true,
                    className: 'success button',
                    wrapperClassName: 'small-12 columns'
                }]
            };
        },
        componentDidMount: function () {
            CRUDRedux.dispatch({ type: 'INIT', list: this.props.categories });
        },
        render: function () {
            var self = this;
            return (
                <div className="row">
                    <div className="small-12 columns">
                        <h2>Categories</h2>

                        <div className="row">
                            {CRUDRedux.getState().map(function (category) {
                                return <Category key={category.id} category={category}/>
                            })}
                        </div>

                        <Create inputs={this.state.inputs} buttons={this.state.buttons} modal={this.state.modalOptions} debug={true}/>
                    </div>
                </div>
            );
        }
    });

    return Categories;
});