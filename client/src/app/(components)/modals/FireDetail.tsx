"import client";
import { Alert } from "@/app/lib/definitions";
import {
  displayFormat,
  convertTime,
  convertDate,
  formatDate,
} from "@/app/lib/utils";
import DOMPurify from "dompurify";

export default function FireDetail({ alert }: { alert: Alert }) {
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Fire Type:</td>
            <td>{displayFormat(alert.fireDetails?.fire_type) ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Fire Size (ha):</td>
            <td>{alert.fireDetails?.fire_size ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Issued by:</td>
            <td>
              {alert.source_id === 1
                ? "Rural Fires Services"
                : "Transport For NSW"}
            </td>
          </tr>
          <tr>
            <td>Containment Status:</td>
            <td>
              {displayFormat(alert.fireDetails?.containment_status) ?? "n/a"}
            </td>
          </tr>
          <tr>
            <td>Responsible Agency:</td>
            <td>
              {displayFormat(alert.fireDetails?.responsible_agency) ?? "n/a"}
            </td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{alert.location_name}</td>
          </tr>
          <tr>
            <td>Postcode:</td>
            <td>{alert.location_postcode ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Council Area:</td>
            <td>{displayFormat(alert.location_council_area) ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Region:</td>
            <td>{displayFormat(alert.location_region) ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Issued:</td>
            <td>{convertTime(alert.issued_at) ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Last update:</td>
            <td>{convertTime(alert.updated_at) ?? "n/a"}</td>
          </tr>
          <tr>
            <td>Source:</td>
            <td>
              {alert.source_url ? (
                <a href={alert.source_url}>{alert.source_url}</a>
              ) : (
                "n/a"
              )}
            </td>
          </tr>
          <tr>
            <td>Planned:</td>
            <td>{alert.planned === true ? "True" : "False"}</td>
          </tr>
          <tr>
            <td>Is Major:</td>
            <td>{alert.is_major === true ? "True" : "False"}</td>
          </tr>
          <tr>
            <td>Network Impacted:</td>
            <td>{alert.impacting_network === true ? "True" : "False"}</td>
          </tr>
          <tr>
            <td>Delay:</td>
            <td>{alert.delay === true ? "True" : "False"}</td>
          </tr>
          <tr>
            <td>Start Date:</td>
            <td>
              <time dateTime={convertDate(alert.start_date) ?? ""}>
                {formatDate(alert.start_date) ?? "n/a"}
              </time>
            </td>
          </tr>
          <tr>
            <td>End Date:</td>
            <td>
              <time dateTime={convertDate(alert.end_date) ?? ""}>
                {formatDate(alert.end_date) ?? "n/a"}
              </time>
            </td>
          </tr>
          <tr>
            <td>source id - remove me</td>
            <td> {alert.source_id}</td>
          </tr>
          <tr>
            <td>category id - remove me</td>
            <td>{alert.category_id}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
