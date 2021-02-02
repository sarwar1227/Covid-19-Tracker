import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

const InfoBox = ({ title, cases, total , ...props}) => {
    return (
        <>
            <Card className={`infoBox ${props.active && "infoBox--selected"} ${props.isRed && "infoBox--red"} `} onClick={props.onClick}>
                <CardContent>
                    <Typography className="infoBox__title" color="textSecondary" >
                        <h2>{title}</h2>
                    </Typography>
                    
                    <h2 className="infoBox__cases">{cases}</h2>

                    <Typography className="infoBox__total" color="textSecondary" >
                        <h2>{total} Total</h2>
                    </Typography>

                </CardContent>
            </Card>
        </>
    );
}

export default InfoBox;