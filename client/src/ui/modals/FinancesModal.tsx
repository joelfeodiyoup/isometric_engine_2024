import styled from "styled-components";
import { ModalInstance } from "../layout-utilities/Modal";

export const FinancesModal = () => {
  return (<>
    <ModalInstance heading="Finances" actions={[]}>
      <table>
        <colgroup>
          <col />
          <col span={3}></col>
        </colgroup>
          {/* <thead></thead> */}
          <tbody>
            <tr>
              <th scope="row">Revenue</th>
              <td>5</td>
              <td>4</td>
              <td>8</td>
            </tr>
          </tbody>
          {/* <thead></thead>
          <tbody></tbody> */}
      </table>
    </ModalInstance>
  </>)
}

// const FinancesTable = styled.table``;

// const FinancesYearRow = styled.tr``;
// const Finances