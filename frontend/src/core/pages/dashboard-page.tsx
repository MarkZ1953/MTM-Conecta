import { UIAutoCompleteMultiple, UIDialog } from "@/components";
import type { Button as ButtonType } from "primereact/button";
import { StyleClass } from "primereact/styleclass";
import React, { useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { DataTable } from "@/components/ui/ui-datatable";

export const DashboardPage = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const btnRef1 = useRef<any>(null);
  const btnRef2 = useRef<any>(null);
  const btnRef3 = useRef<any>(null);
  const btnRef4 = useRef<any>(null);

  return (
    <>
      <DataTable data={[]} columns={[]} pageIndex={0} pageSize={10} totalCount={0} onPageSizeChange={() => { }} sorting={[]} onSortingChange={() => { }} onPageChange={() => { }} />
    </>
  );
};
