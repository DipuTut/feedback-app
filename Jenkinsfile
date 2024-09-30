pipeline {
    agent any
    
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        GITHUB_REPO = 'https://github.com/DipuTut/feedback-app.git'
    }
    
    stages {     
        stage('Checkout') {

            steps {
                git url: "${GITHUB_REPO}", branch: 'main'
                sh 'ls -la'
            }     
        }     
        stage('Build') {
            
            steps {
                echo 'Building the app...'
                echo 'Build successful.'
            }        
        }
    }
}