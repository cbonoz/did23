import { APP_NAME } from "../constants";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';



const Verified = ({ verified }) => {

    return <span>
        {verified ?
            <span className='success-text'><CheckCircleOutlined /> Account Verified</span> : 
            <span className='error-text'><CloseCircleOutlined /> Account Unverified</span>}
    </span>


}

export default Verified;