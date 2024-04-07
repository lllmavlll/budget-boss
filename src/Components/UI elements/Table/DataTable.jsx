import React from 'react'
import Card from '../Card/Card'
import { MDBDataTable } from 'mdbreact'
import './DataTable.css'


const DataTable = ({ data, size }) => {
  return (
    <Card size={size}>
      <div className="table-responsive OFtable-res">
        <table className="table table-bordered OFtable ">
          <tbody>

            <MDBDataTable
              bordered
              noBottomColumns
              data={data}
            />
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default DataTable