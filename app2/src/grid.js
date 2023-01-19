import React from 'react';
import ReactDOM from 'react-dom';
import { Grid } from '@mui/material';
export default function GridComponent(){
    return(
        <Grid container spacing={1}>
        <Grid item xs={8}>
            <div style={{border: 'solid'}}>xs=8</div>
        </Grid>
        <Grid item xs={4}>
            <div style={{border: 'solid'}}>xs=8</div>
        </Grid>
        <Grid item xs={4}>
            <div style={{border: 'solid'}}>xs=8</div>
        </Grid>
        <Grid item xs={8}>
            <div style={{border: 'solid'}}>xs=8</div>
        </Grid>
        </Grid>
    )
}