import { Routes, Route } from "react-router-dom"

import { AppLayout } from "./components/AppLayout"
import { ApplicationList } from "./routes/ApplicationList"
import { ApplicationCreate } from "./routes/ApplicationCreate"
import { ApplicationDetail } from "./routes/ApplicationDetail"
import { ApplicationEdit } from "./routes/ApplicationEdit"
import { ApplicationReview } from "./routes/ApplicationReview"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ApplicationList />} />
        <Route path="/applications/new" element={<ApplicationCreate />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/applications/:id/edit" element={<ApplicationEdit />} />
        <Route path="/applications/:id/review" element={<ApplicationReview />} />
      </Route>
    </Routes>
  )
}
