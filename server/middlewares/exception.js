
const catchError = async (ctx,next)=>{
    try{
        await next()
    }catch(error){
        ctx.body = error
    }
}

module.exports = catchError