import { Fieldset } from "primereact/fieldset";
import "./main.css";
import Search from "../../search/search";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import AccountsTable from "../../accountTable/accountsTable";
import { fetchLocationDataService } from "../../../../redux/actions/accountsActions";


const Auditoria = () => {
  const accounts = useSelector((state) => state.accounts);
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchLocationDataService());
  },[]);

  useEffect(() => {
    setLoading(accounts.loading);
  }, [accounts.loading]);

  useEffect(() => {
    setData(accounts.data != null ? accounts.data : [])
  }, [accounts.data]);

  return (
    <div className="responsive-container">
      <Fieldset legend="Búsqueda">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-content-center align-items-center bg-black-alpha-50 z-5">
            <ProgressSpinner />
          </div>
        )}
        <Search />
        <div className="mt-4">
        <div style={{'display':data != [] > 0  ? 'block' : 'none'}}>
          <AccountsTable tableData={data} />
        </div>
      </div>
      </Fieldset>
</div>
  );
};

export default Auditoria;