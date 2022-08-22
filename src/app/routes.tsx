import Console from '#P/@console/Console'
import DiscDetailOfAsin from '#P/@disc/DiscDetail/DiscDetailOfAsin'
import DiscDetailOfId from '#P/@disc/DiscDetail/DiscDetailOfId'
import DiscsOfDiscGroup from '#P/@disc/Discs/DiscsOfDiscGroup'
import DiscComing from '#P/@discComing/DiscComing'
import DiscGroupAdd from '#P/@discGroup/DiscGroupAdd/DiscGroupAdd'
import DiscGroupDetail from '#P/@discGroup/DiscGroupDetail/DiscGroupDetail'
import DiscGroupItems from '#P/@discGroup/DiscGroupItems/DiscGroupItems'
import DiscGroups from '#P/@discGroup/DiscGroups/DiscGroups'
import UserAdd from '#P/@user/UserAdd/UserAdd'
import UserDetail from '#P/@user/UserDetail/UserDetail'
import Users from '#P/@user/Users/Users'
import NotFound from '#P/notfound/NotFound'
import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const LazyDiscRecords = lazy(
  () => import(/* webpackChunkName: "disc_records" */ '#P/@disc/DiscRecords/DiscRecords')
)

export const routes = (
  <Suspense fallback={<Spin delay={200} />}>
    <Routes>
      <Route path="/" element={<Navigate to="/disc_groups" />} />
      <Route path="/disc_groups" element={<DiscGroups />} />
      <Route path="/disc_groups/add" element={<DiscGroupAdd />} />
      <Route path="/disc_groups/:key" element={<DiscGroupDetail />} />
      <Route path="/disc_groups/:key/discs" element={<DiscGroupItems />} />
      <Route path="/discs/disc_groups/:key" element={<DiscsOfDiscGroup />} />
      <Route path="/discs/asin/:asin" element={<DiscDetailOfAsin />} />
      <Route path="/discs/:id" element={<DiscDetailOfId />} />
      <Route path="/discs/:id/records" element={<LazyDiscRecords />} />
      <Route path="/disc_coming" element={<DiscComing />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/add" element={<UserAdd />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/console" element={<Console />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)
