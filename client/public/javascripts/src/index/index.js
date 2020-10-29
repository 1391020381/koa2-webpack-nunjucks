import axios from 'axios'
import 'less/index.less'
console.log('index!!!!!!!!!!!!!!')
const isDev = process.env.NODE_ENV === 'development'

if(isDev){
    require('raw-loader!../../../../../dev-views/views/index.html')
}
if(module.hot){
    module.hot.accept()
    module.hot.dispose(() => {
		const href = window.location.href
		axios.get(href).then(res => {
			const template = res.data
			document.body.innerHTML = template
		}).catch(e => {
			console.error(e)
		})
	})
}