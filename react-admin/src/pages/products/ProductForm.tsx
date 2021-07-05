import Layout from '../../components/Layout';
import { TextField, Button } from '@material-ui/core';
import { SyntheticEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const ProductForm = (props: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if(props.match.params.id) {
      (
        async () => {
          const { data } = await axios.get(`products/${props.match.params.id}`);
          setTitle(data.title);
          setDescription(data.description);
          setImage(data.image);
          setPrice(data.price);
        }
      )();
    }
  }, [props.match.params.id])

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      image,
      price
    };
    if(props.match.params.id) {
      await axios.put(`products/${props.match.params.id}`, data);
    } else {
      await axios.post('products', data);
    }
    setRedirect(true);
  }
  if(redirect) {
    return <Redirect to={'/products'} />
  }
  return (
    <Layout>
      <form onSubmit={submit} >
        <div className="mb-3">
          <TextField label="Title" onChange={e => setTitle(e.target.value)} value={title}/>
        </div>
        <div className="mb-3">
          <TextField label="Description" rows="4" multiline onChange={e => setDescription(e.target.value)}  value={description}/>
        </div>
        <div className="mb-3">
          <TextField label="Image" onChange={e => setImage(e.target.value)}  value={image}/>
        </div>
        <div className="mb-3">
          <TextField label="Price" type="number" onChange={e => setPrice(parseFloat(e.target.value))}  value={price} />
        </div>
        <Button variant="contained" color="primary" type="submit">{props.match.params.id ? "Update" : "Submit" }</Button>
      </form>
    </Layout>
  )
}

export default ProductForm;
