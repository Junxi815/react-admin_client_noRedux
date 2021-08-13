export function formatDate(time){
    if(!time) return ''
    let date = new Date(time)
    return date.getFullYear()+'-'+wrapNumber(date.getMonth()+1)+'-'+wrapNumber(date.getDate())+' '
            + wrapNumber(date.getHours())+':'+wrapNumber(date.getMinutes())+':'+wrapNumber(date.getSeconds())
}

function wrapNumber(number){
    return number<10 ? '0'+number : ''+number
}