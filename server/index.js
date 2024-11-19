const PORT =  process.env.PORT?? 8000
const express = require('express')
const {v4: uuidv4} = require ('uuid')
const cors =require('cors')
const app = express()
const pool = require('./db')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())
//get all todos
app.get('/todos/:userEmail', async (req, res)=>{
   
   const {userEmail} = req.params
   console.log(userEmail)
   try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1 ', [userEmail])
    res.json(todos.rows)
   } catch (err){
    console.log(err)
   }
})
// create a new todo
app.post('/todos', async (req,res) => {
   const {user_email,title,progress,date}= req.body
   console.log(user_email,title,progress,date)
   const id = uuidv4();
   try{
  const newTodo= await pool.query('INSERT INTO todos(id, user_email,title,progress,date)VALUES($1,$2,$3,$4,$5)',
  [id,user_email,title,progress,date])
  res.json(newTodo);
}catch (err){
   console.error(err)
}
})
// edit a todo
app.put('/todos/:id', async(req,res) =>{
   const {id} = req.params;
   const {user_email,title,progress,date}= req.body;
   console.log(user_email,title,progress,date)
   try{
      const editTodo= await pool.query('UPDATE todos SET user_email = $1, title = $2,progress = $3, date= $4 WHERE id = $5;',
      [user_email,title,progress,date,id] );
      res.json(editTodo);
   }catch(err){
      console.error(err)
   }
})

// DELETE a todo
app.delete('/todos/:id', async(req,res) =>{
   const {id} = req.params;
      try{
      const deleteTodo= await pool.query('DELETE FROM todos WHERE id = $1;',[id])
      res.json(deleteTodo);
      }catch(err){
         console.error(err)
      }
   
})


// Signup route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    try {
      // Check if email already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (existingUser.rows.length > 0) {
        // If email exists, return an error
        return res.json({ detail: 'Email already in use!' });
      }
  
      // Proceed with inserting new user
      await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)', [email, hashedPassword]);
  
      // Create a JWT token
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
  
      // Respond with email and token
      res.json({ email, token });
  
    } catch (err) {
      console.error(err);
      res.json({ detail: 'Error during signup!' });
    }
  });
  
  // Login route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      // Check if the user exists
      if (!result.rows.length) {
        return res.json({ detail: 'User does not exist!' });
      }
  
      const success = await bcrypt.compare(password, result.rows[0].hashed_password);
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
  
      if (success) {
        res.json({ email: result.rows[0].email, token });
      } else {
        res.json({ detail: 'Invalid details!' });
      }
    } catch (err) {
      console.error(err);
    }
  });
  

app.listen(PORT,()=> console.log(`Server running on PORT ${PORT}`))