import Layout from '../components/Layout';
import { useRouter } from 'next/dist/client/router';
import { SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import constants from '../constants';
declare var stripe;

export default function Home() {
  const router = useRouter();
  const { code } = router.query;
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address , setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (code != undefined) {
      (
        async () => {
          const { data } = await axios.get(`${constants.endPoint}/links/${code}`, { withCredentials: true });
          setUser(data.user);
          setProducts(data.products);
          setQuantities(data.products.map(product => ({
            product_id: product.id,
            quantity: 0
          })));
        }
      )();
    }
  }, [code]);

  const updateQuantity = (id: number, quantity: number) => {
    setQuantities(quantities.map(q => {
      if(q.product_id === id) {
        return {
          ...q,
          quantity
        }
      }

      return q;
    }))
  }

  const total = () => {
    return quantities.reduce((s, q) => {
      const product = products.find(p => p.id ===q.product_id);
      return s + product.price * q.quantity;
    }, 0);
  }

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { data } = await axios.post(`${constants.endPoint}/orders`, {
      first_name,
      last_name,
      email,
      address,
      country,
      city,
      zip,
      code,
      products: quantities
    });
    console.log(data);
    const stripe = new Stripe(constants.stripe_key);
    stripe.redirectToCheckout({
      sessionId: data.id
    });
  }
  return (
    <Layout>
      <main>
        <div className="py-5 text-center">
          <h2>Welcome Here</h2>
          <p className="lead">{user?.first_name} {user?.last_name} has invited you to buy these products</p>
        </div>

        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Products</span>
            </h4>
            <ul className="list-group mb-3">
              {
                products.map(product => {
                  return (
                    <div key={product.id}>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">{product.title}</h6>
                        <small className="text-muted">{product.description}</small>
                      </div>
                      <span className="text-muted">${product.price}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">{product.quantity}</h6>
                      </div>
                      <input type="number" min="0" className="text-muted form-control" style={{width: "65px" }} defaultValue={0}
                        onChange={e => updateQuantity(product.id, parseInt(e.target.value))}
                      />
                    </li>
                    </div>
                  )
                })
              }
              
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>{total()}</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Personal Info</h4>
            <form className="needs-validation" onSubmit={submit}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="First Name" required
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>

                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="Last Name" required
                    onChange={e => setLastName(e.target.value)} />
                </div>

                <div className="col-12">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="you@example.com" required
                    onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" className="form-control" id="address" placeholder="1234 Main St" required
                    onChange={e => setAddress(e.target.value)} />
                </div>

                <div className="col-md-5">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input type="text" className="form-control" id="country" placeholder="Country"
                    onChange={e => setCountry(e.target.value)} />
                </div>

                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">State</label>
                  <input type="text" className="form-control" id="city" placeholder="City"
                    onChange={e => setCity(e.target.value)} />
                </div>

                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">Zip</label>
                  <input type="text" className="form-control" id="zip" placeholder="Zip"
                    onChange={e => setZip(e.target.value)} />
                </div>
              </div>

              <hr className="my-4" />

              <button className="w-100 btn btn-primary btn-lg" type="submit">Checkout</button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  )
}
