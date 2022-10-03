import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import DiscComing from '#P/disc-coming/DiscComing'
import DiscGroups from '#P/disc-groups/DiscGroups'
import DiscGroupAdd from '#P/disc-group-add/DiscGroupAdd'
import DiscGroupDetail from '#P/disc-group-detail/DiscGroupDetail'
import DiscGroupViewList from '#P/disc-group-view-list/DiscGroupViewList'
import DiscGroupEditList from '#P/disc-group-edit-list/DiscGroupEditList'
import DiscAdd from '#P/disc-add/DiscAdd'
import DiscDetailOfId from '#P/disc-detail/DiscDetailOfId'
import DiscDetailOfAsin from '#P/disc-detail/DiscDetailOfAsin'
import Users from '#P/users/Users'
import UserAdd from '#P/user-add/UserAdd'
import UserDetail from '#P/user-detail/UserDetail'
import Console from '#P/console/Console'
import NotFound from '#P/notfound/NotFound'

import { linkToComing, linkToDiscs, linkToGroups, linkToMsgs, linkToUsers } from '#A/links'

const LazyDiscRecords = lazy(
  () => import(/* webpackChunkName: "disc_records" */ '#P/disc-records/DiscRecords')
)

export const routes = (
  <Suspense fallback={<Spin delay={200} />}>
    <Routes>
      <Route path="/" element={<Navigate to="/disc_groups" />} />

      <Route path={linkToGroups()} element={<DiscGroups />} />
      <Route path={linkToGroups(`/add`)} element={<DiscGroupAdd />} />
      <Route path={linkToGroups(`/:key`)} element={<DiscGroupDetail />} />
      <Route path={linkToGroups(`/:key/discs`)} element={<DiscGroupViewList />} />
      <Route path={linkToGroups(`/:key/discs/edit`)} element={<DiscGroupEditList />} />
      <Route path={linkToComing()} element={<DiscComing />} />
      <Route path={linkToDiscs(`/:id`)} element={<DiscDetailOfId />} />
      <Route path={linkToDiscs(`/asin/:asin`)} element={<DiscDetailOfAsin />} />
      <Route path={linkToDiscs(`/add`)} element={<DiscAdd />} />
      <Route path={linkToDiscs(`/:id/records`)} element={<LazyDiscRecords />} />
      <Route path={linkToUsers()} element={<Users />} />
      <Route path={linkToUsers(`/add`)} element={<UserAdd />} />
      <Route path={linkToUsers(`/:id`)} element={<UserDetail />} />
      <Route path={linkToMsgs()} element={<Console />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)
