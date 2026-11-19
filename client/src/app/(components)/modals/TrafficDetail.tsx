"import client";
import { Alert } from "@/app/lib/definitions";
import {
  displayFormat,
  convertTime,
  convertDate,
  formatDate,
} from "@/app/lib/utils";
import DOMPurify from "dompurify";

function AlertDescription({ description }: { description: string }) {
  const clean = DOMPurify.sanitize(description);
  return (
    <div
      className="alert-description"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default function TrafficDetail({ alert }: { alert: Alert }) {
  console.log(alert);
  return (
    <>
      <AlertDescription description={alert.description} />
      <hr />
      <table style={{ marginTop: "15px" }}>
        <tbody>
          <tr>
            <td>Advice:</td>
            <td>
              {alert.advice && alert.advice.length > 0 && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: alert.advice.map((item) => item.message).join(", "),
                  }}
                />
              )}
            </td>
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
        </tbody>
      </table>
    </>
  );
}
