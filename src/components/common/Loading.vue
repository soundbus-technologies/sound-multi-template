<template>
    <div class="loading-box" v-if="showLoad">
        <div class="loading">
          <svg id="loading" width='80px' height='80px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
             preserveAspectRatio="xMidYMid" class="uil-default">
            <rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(0 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(30 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(60 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(90 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(120 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(150 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(180 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(210 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(240 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(270 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(300 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s'
                         repeatCount='indefinite'/>
            </rect>
            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#8c8c8c'
                  transform='rotate(330 50 50) translate(0 -30)'>
                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s'
                         repeatCount='indefinite'/>
            </rect>
        </svg>
          <p v-text="loadingTxt"></p>
        </div>
    </div>
</template>

<style>
    .loading-box {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        text-align: center;
        background: rgba(0,0,0,.3);
        z-index: 9999;
    }
    #loading {
        display: inline-block;
        margin: .6rem 0 .3rem 0;
    }
    .loading {
        position: absolute;
        display: inline-block;
        top: 45%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.2rem;
        background: rgba(0, 0, 0, .65);
    }
    .loading p {
        text-align: center;
        font-size: 0.45rem;
        color: rgba(255, 255, 255, .9);
    }
</style>

<script>
    export default{
        data() {
            return {
            };
        },
        props: ['showLoad', 'loadingTxt'],
    };
</script>
