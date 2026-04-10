import { Route, Switch, useLocation } from 'wouter'
import { useEffect } from 'react'
import { useStore } from './lib/store'

function ScrollToTop() {
  const [location] = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location])
  return null
}
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Purchase from './pages/Purchase'
import Checkout from './pages/Checkout'
import PixPayment from './pages/PixPayment'
import OrderConfirmation from './pages/OrderConfirmation'
import Admin from './pages/admin/Admin'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refund from './pages/Refund'

export default function App() {
  const setPackages = useStore((s) => s.setPackages)
  const setCharacters = useStore((s) => s.setCharacters)

  useEffect(() => {
    fetch('/api/packages').then((r) => r.json()).then(setPackages).catch(console.error)
    fetch('/api/characters').then((r) => r.json()).then(setCharacters).catch(console.error)
  }, [])

  return (
    <Switch>
      <Route path="/admin/:rest*" component={Admin} />
      <Route>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <Header />
          <main className="flex-1 pt-16">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/purchase" component={Purchase} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/pix-payment/:orderId" component={PixPayment} />
              <Route path="/order-confirmation" component={OrderConfirmation} />
              <Route path="/faq" component={FAQ} />
              <Route path="/contact" component={Contact} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/refund" component={Refund} />
              <Route>
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold">Página não encontrada</h1>
                </div>
              </Route>
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  )
}
