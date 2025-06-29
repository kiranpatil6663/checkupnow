import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AppContextprovider from './context/AppContext.jsx'



createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <AppContextprovider>
    <App />
    </AppContextprovider>
    </BrowserRouter>,
)
