﻿

//Generates input fields with label. Required structure for 'inputs':
//[{
//    label: 'Label',
//    name: 'Name of the input field. Also used in the id of the html element unless if type is radio or checkbox. If type is radio or checkbox, this should be an array',
//    jsonName: 'Map name -> for CRUDRedux witch maps all input values to a json object',
//    type: 'Type of input; number, text, url',
//    value: null, //'Initial value of the input field'
//    defaultValue: null, //Used for checkboxes and radio buttons. Checkboxes takes an array [] and radio buttons takes a string as defaultValue
//    options: null, //Array of options for select, radio and checkbox
//    checked: null,
//    disabled: null,
//    //onChange : Here you can for example define an additional redux dispatcher which
//    //           will be called back with event and index of the field as paramters on input change'.
//    onChange: (event, index) =>MockRedux.dispatch({ type: 'CHANGE', event: event, index: index }),
//    placeholder: 'Placeholder text if any. For textare this will ignored but you can use "value" if you want initiate a text in the textarea',
//    wrapperClassName: 'Classes to add to the div surrounding the input',
//    labelClassName: 'Classes to add to the label',
//    inputClassName: 'Classes to add to the input'
//}]

//Buttons. Required structure for 'buttons'
//[{
//    name: 'For example: Submit. Will be the label of the button',
//    action: 'Action. Can be null',
//    clearFormAfterAction: 'If you want to clear the form after action has been run'
//    className: 'Classes to add to the div surrounding the input',
//    wrapperClassName: 'If you want to add a wrapper class to the div outside the button',
//}]


define(['react', 'jsx!CRUD/CreateRedux'], function (React, CreateRedux) {
    var Create = React.createClass({
        hasInitiated: false,
        getInitialState: function () {
            if (!this.props.inputs) {
                console.error('"inputs" is not defined. Did you forget to add it to the <Create /> component?');
            }
            if (!this.props.buttons) {
                console.error('"buttons" is not defined. Did you forget to add it to the <Create /> component?');
            }

            return {
                inputs: this.props.inputs,
                buttons: this.props.buttons
            }
        },
        onChangeHandler: function (event, index, callback) {
            CreateRedux.dispatch({ type: 'CHANGE', event: event, index: index });
            if (callback) {
                callback(event, index);
            }
        },
        buttonClickHanlder: function (event, clear, callback) {
            event.preventDefault();
            if (callback) {
                var inputsCopy = this.state.inputs.slice();
                callback(event, inputsCopy);
            }
            if (clear) {
                CreateRedux.dispatch({ type: 'CLEAR' });
            }
        },
        componentDidMount: function () {
            CreateRedux.dispatch({ type: 'INIT', list: this.state.inputs });
        },
        render: function () {
            var self = this;
            return (
                <form>
                    <div className="row">
                        {this.state.inputs.map(function (input, index) {
                            var label = (
                                <label key={input.name + 'label' }
                                        htmlFor={input.name}
                                        className={input.labelClassName}>{input.label}</label>
                            );


                            switch (input.type) {
                                case 'textarea':
                                    return (
                                        <div key={input.name + 'classes'} className={input.wrapperClassName}>
                                            {label}
                                             <textarea key={input.name}
                                                       id={input.id}
                                                       name={input.name}
                                                       value={input.value}
                                                       disabled={input.disabled}
                                                       className={input.labelClassName}
                                                       onChange={(event) => self.onChangeHandler(event, index, input.onChange)}></textarea>
                                        </div>
                                    );
                                    break;
                                case 'radio':
                                case 'checkbox':
                                    if (Array.isArray(input.value) && (!input.options || !Array.isArray(input.options))) {
                                        console.error('For radio or checkbox types, the "value" property should be null. Use "options" instead to define multiple checkboxes, f.ex ["cars", "toys"]. Default values can be set by using defaultValue, f.ex ["toys", "cars"]');
                                        return;
                                    }
                                    if (input.checked || Array.isArray(input.checked)) {
                                        console.error('Trying to make something checked by default? Default values can be set by using defaultValue, f.ex ["toys", "cars"]');
                                        return;
                                    }
                                    if (input.type === 'radio' && input.defaultValue && typeof input.defaultValue !== "string") {
                                        console.error('Radio button defaultValue should be a string!');
                                        return;
                                    }

                                    var multiInputs = [];
                                    input.options.map(function (checkboxRadioOption, checkboxRadioIndex) {
                                        multiInputs.push(
                                            <input key={input.name + checkboxRadioIndex}
                                                    type={input.type}
                                                    id={checkboxRadioOption.trim()}
                                                    name={checkboxRadioOption.trim()}
                                                    value={checkboxRadioOption}
                                                    checked={input.value && (input.value.indexOf(checkboxRadioOption) !== -1 && input.type === "checkbox") || (input.value === checkboxRadioOption && input.type === "radio")}
                                                    className={input.labelClassName}
                                                    onChange={(event) => self.onChangeHandler(event, index, input.onChange)} />
                                            );
                                        multiInputs.push(
                                            <label key={checkboxRadioOption.trim()} htmlFor={checkboxRadioOption.trim() }>{checkboxRadioOption}</label>
                                            );
                                    });
                                    return (
                                        <fieldset key={input.label+'fieldset'} className={input.wrapperClassName}>
                                            <legend key={input.label+'legend'}>{input.label}</legend>
                                            { multiInputs }
                                        </fieldset>
                                        );
                                    break;
                                default:
                                    return (
                                        <div key={input.name + 'classes'} className={input.wrapperClassName}>
                                            {label}
                                             <input key={input.name}
                                                    id={input.name}
                                                    type={input.type}
                                                    name={input.name}
                                                    placeholder={input.placeholder}
                                                    value={input.value}
                                                    disabled={input.disabled}
                                                    className={input.labelClassName}
                                                    onChange={(event) => self.onChangeHandler(event, index, input.onChange)} />
                                        </div>
                                    );
                                    break;
                            }
                            parent.hasInitiated = true;
                        })}
                    </div>
                    <div className="row">
                        {this.state.buttons.map(function (button) {
                            return (
                                <div key={button.name+'wrapper'} className={button.wrapperClassName}>
                                    <button key={button.name}
                                            id={button.name}
                                            className={button.className}
                                            onClick={(event) => self.buttonClickHanlder(event, button.clearFormAfterAction, button.action )}>
                                        {button.name}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </form>
            );
        }
    });

    return Create;
});