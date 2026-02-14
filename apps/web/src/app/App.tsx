import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "sonner";


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
              <Route path="/" element={<div>Home Page</div>} />
          </Routes>
          <Toaster richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
