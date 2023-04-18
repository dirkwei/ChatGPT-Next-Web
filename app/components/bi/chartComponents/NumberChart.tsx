import React, { useMemo, useState } from "react";
import { Row, Col, Statistic, Checkbox, Divider } from "antd";
import {ResultRoot} from "../types";

interface IProps {
  resultSet: ResultRoot;
  chartConfig: ChartConfigDetail;
  onChartConfigChange: (config: ChartConfigDetail) => void;
  canEdit?: boolean;
}

const NumberChart: React.FC<IProps> = ({
  canEdit,
  chartConfig,
  onChartConfigChange,
  resultSet,
}) => {
  // 修改图表配置
  const onUpdateConfig = (config: INumberChartConfig) => {
    onChartConfigChange({ ...chartConfig, ...config });
  };

  const generateMeasureData = (resultSet: ResultRoot) => {
    const measure = Object.keys(resultSet?.annotation.measures)[0]
    const data = resultSet?.data?.[0][measure]

    return Number(data)
  }

  // 环比数据集合
  const [chainData, setChainData] = useState<Array<number>>([generateMeasureData(resultSet)]);



  // 将环比数据结构
  // const resultGroup = useMemo<ResultSet[]>(() => {
  //   const sets = resultSet.decompose();
  //   return sets;
  // }, [resultSet]);
  //
  // useDeepEffect(() => {
  //   const data = [];
  //
  //   resultGroup.forEach((currentResultSet, index) => {
  //     currentResultSet.seriesNames().map((s, i) => {
  //       if (i > 0) {
  //         return;
  //       }
  //       data[index] = currentResultSet.totalRow()[s.key];
  //     });
  //   });
  //
  //   setChainData(data);
  // }, [resultGroup]);

  // 计算环比数值
  // const chainRatio = useMemo(() => {
  //   if (isEmpty(chainData)) {
  //     return null;
  //   }
  //
  //   const thisTermVal = chainData[0];
  //   const prevVal = chainData[1];
  //
  //   return (thisTermVal - prevVal) / prevVal;
  // }, [chainData]);

  return (
    <>
      {/*{!!canEdit && (*/}
      {/*  <Row>*/}
      {/*    <Checkbox*/}
      {/*      defaultChecked={chartConfig?.showChainComparison}*/}
      {/*      onChange={(e) =>*/}
      {/*        onUpdateConfig({ showChainComparison: e.target.checked })*/}
      {/*      }*/}
      {/*    >*/}
      {/*      显示环比*/}
      {/*    </Checkbox>*/}
      {/*    <Divider />*/}
      {/*  </Row>*/}
      {/*)}*/}

      <Row
        align="middle"
        justify="center"
        style={{
          height: "100%",
        }}
      >
        <Col>
          <Statistic value={chainData[0] || "--"} />
          {/*{!!chartConfig?.showChainComparison && chainData.length > 1 && (*/}
          {/*  <div>*/}
          {/*    环比：*/}
          {/*    <span*/}
          {/*      style={{*/}
          {/*        color:*/}
          {/*          chainRatio > 0*/}
          {/*            ? "var(--red-color)"*/}
          {/*            : chainRatio < 0*/}
          {/*            ? "var(--green-color)"*/}
          {/*            : "var(--text-color)",*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      {Math.round(chainRatio * 10000) / 100 + "%"}*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </Col>
      </Row>
    </>
  );
};

export default NumberChart;
