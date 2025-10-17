import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';
import { UpdateUser } from './pages/UpdateUser';


function App() {
  return (
    <div className=" inset-0 -z-10  w-full  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] pb-2">
      <BrowserRouter>

        <Routes >
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
          <Route path='/updateUser' element={<UpdateUser />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
