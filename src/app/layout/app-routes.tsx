import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Console from '#P/@console/Console'
import NotFound from '#P/notfound/NotFound'

import DiscComing from '#P/disc-coming/DiscComing'
import DiscGroups from '#P/disc-groups/DiscGroups'
import DiscGroupAdd from '#P/disc-group-add/DiscGroupAdd'
import DiscGroupDetail from '#P/disc-group-detail/DiscGroupDetail'
import DiscGroupViewList from '#P/disc-group-view-list/DiscGroupViewList'
import DiscGroupEditList from '#P/disc-group-edit-list/DiscGroupEditList'
import DiscDetailOfId from '#P/disc-detail/DiscDetailOfId'
import DiscDetailOfAsin from '#P/disc-detail/DiscDetailOfAsin'
import Users from '#P/users/Users'
import UserAdd from '#P/user-add/UserAdd'
import UserDetail from '#P/user-detail/UserDetail'

const LazyDiscRecords = lazy(
  () => import(/* webpackChunkName: "disc_records" */ '#P/disc-records/DiscRecords')
)

export const routes = (
  <Suspense fallback={<Spin delay={200} />}>
    <Routes>
      <Route path="/" element={<Navigate to="/disc_groups" />} />

      <Route path="/discs/:id/records" element={<LazyDiscRecords />} />
      <Route path="/console" element={<Console />} />

      <Route path="/disc_coming" element={<DiscComing />} />
      <Route path="/disc_groups" element={<DiscGroups />} />
      <Route path="/disc_groups/add" element={<DiscGroupAdd />} />
      <Route path="/disc_groups/:key" element={<DiscGroupDetail />} />
      <Route path="/disc_groups/:key/discs" element={<DiscGroupViewList />} />
      <Route path="/disc_groups/:key/discs/edit" element={<DiscGroupEditList />} />
      <Route path="/discs/:id" element={<DiscDetailOfId />} />
      <Route path="/discs/asin/:asin" element={<DiscDetailOfAsin />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/add" element={<UserAdd />} />
      <Route path="/users/:id" element={<UserDetail />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)
