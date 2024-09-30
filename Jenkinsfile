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
            }            
        }       
        stage('Docker Build') {   
            steps {
                echo 'Building the app...'
                sh 'docker build -t asadulhaque90/feedback-app:pipeline-test'
                echo 'Build successful.'
            }    
        }
        stage('Docker Push') {
            steps {
                echo 'Pushing the image to Docker Hub...'
                sh 'docker push asadulhaque90/feedback-app:pipeline-test'
                echo 'Push successful.'
            }
        }
        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to kubernetes cluster...'
                sh 'kubectl apply -f kubernetes/api-deployment.yaml'
                echo 'Deployment successful.'
            }
        }
    }   
}