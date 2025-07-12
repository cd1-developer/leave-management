import React, { useMemo, useEffect, useState } from "react";

import TeamStructureHeader from "./TeamStructureHeader";
import ReportManagerCompo from "./ReportManagerCompo";

function TeamStructure() {
  return (
    <section className="mt-5 md:container">
      <TeamStructureHeader />
      <ReportManagerCompo />
    </section>
  );
}
export default TeamStructure;
