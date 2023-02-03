import 'semantic-ui-css/semantic.min.css'
import React, { useEffect } from 'react'
import { Dropdown, Grid } from 'semantic-ui-react'
import data from '../format.json';
import { useState } from 'react';
import axios from 'axios';

export default function DropdownComp(props) {
    const format = data.format;
    const [input, setInput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const display = [{ value: "", text: "No data found", disabled: true }]
    const [newDisplay, setDisplay] = useState([])
    useEffect(() => {
        if (format.dataSource === 'api') {
            setIsLoading(true)
            axios.get(format.url)
                .then(resp => {
                    let newContent = [{ value: "", text: format.displayName, disabled: true }];
                    for (const key in resp.data) {
                        newContent.push({
                            value: resp.data[key][`${format.responseSchema}`].toLowerCase(),
                            text: resp.data[key][`${format.responseSchema}`]
                        });
                    }
                    setDisplay(newContent);
                    setIsLoading(false);
                })
                .catch(err => console.log(err))
        } else {
            setDisplay(display);
        }
    }, [format])



    for (const item in newDisplay) {
        if (newDisplay[item].value.toLowerCase() === format.defaultValue)
            newDisplay[item] = {
                value: newDisplay[item].value,
                text: newDisplay[item].text,
                default: true
            }
    }

    return (
        <Grid divided="vertically">
            <Grid.Row columns={16}>
                <Grid.Column width={format.width}>
                    <Dropdown
                        placeholder={format.displayName}
                        fluid
                        search
                        selection
                        options={newDisplay}
                        required={format.required}
                        disabled={!format.editable}
                        loading={isLoading}
                        onChange={(e, { value }) => {
                            setInput(value.charAt(0).toUpperCase() + value.slice(1))
                        }}
                    >
                    </Dropdown>
                    <p>{input && input}</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}