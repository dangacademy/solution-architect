1. Currently app docker not working wihout node_module in local system
    Possible Reason : when local volume is mount using docker-compose then it might be removing folder and file which was generated during docker-build
2. Add mode -> Dev and Production
3. Auto Restart node container on code change in dev mode