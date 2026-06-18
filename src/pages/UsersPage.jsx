import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {createUser,getUsers} from '../api.js';
export default function UsersPage({user}){const[users,setUsers]=useState([]);const[u,su]=useState('');const[p,sp]=useState('');
useEffect(()=>{getUsers().then(setUsers)},[]);
const add=async()=>{await createUser(u,p,false);setUsers(await getUsers());};
return <div className='p-6'><nav><Link to='/'>Houses</Link> | <Link to='/users'>Users</Link></nav><h1>Users</h1>{user?.isAdmin&&<><input value={u} onChange={e=>su(e.target.value)} placeholder='user'/><input value={p} onChange={e=>sp(e.target.value)} placeholder='pass'/><button onClick={add}>Create</button></>}{users.map(x=><div key={x.id}>{x.username}</div>)}</div>}